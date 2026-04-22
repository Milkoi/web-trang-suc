using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using web_Trang_suc_BE.Helpers;
using PayOS;
using PayOS.Models.V2.PaymentRequests;

namespace web_Trang_suc_BE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public PaymentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class PaymentRequestDto
        {
            public string OrderId { get; set; } = string.Empty;
            public decimal Amount { get; set; }
        }

        [HttpPost("create-vnpay-url")]
        public IActionResult CreatePaymentUrl([FromBody] PaymentRequestDto request)
        {
            var ipAddr = Utils.GetIpAddress(HttpContext);

            var vnp_Returnurl = _configuration["Vnpay:ReturnUrl"];
            var vnp_Url = _configuration["Vnpay:BaseUrl"];
            var vnp_TmnCode = _configuration["Vnpay:TmnCode"];
            var vnp_HashSecret = _configuration["Vnpay:HashSecret"];

            if (string.IsNullOrEmpty(vnp_TmnCode) || string.IsNullOrEmpty(vnp_HashSecret))
            {
                return BadRequest("VNPAY configuration is missing.");
            }

            var vnpay = new VnPayLibrary();

            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
            vnpay.AddRequestData("vnp_Amount", ((long)(request.Amount * 100)).ToString()); 
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", ipAddr);
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang:" + request.OrderId);
            vnpay.AddRequestData("vnp_OrderType", "other"); // default
            vnpay.AddRequestData("vnp_ReturnUrl", vnp_Returnurl ?? string.Empty);
            vnpay.AddRequestData("vnp_TxnRef", request.OrderId);

            var paymentUrl = vnpay.CreateRequestUrl(vnp_Url ?? string.Empty, vnp_HashSecret);

            return Ok(new { url = paymentUrl });
        }

        [HttpGet("vnpay-return")]
        public IActionResult VnpayReturn()
        {
            var vnpayData = Request.Query;
            var vnpay = new VnPayLibrary();

            foreach (var kv in vnpayData)
            {
                if (!string.IsNullOrEmpty(kv.Key) && kv.Key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(kv.Key, kv.Value.ToString());
                }
            }

            var vnp_orderId = vnpay.GetResponseData("vnp_TxnRef");
            var vnp_TransactionId = vnpay.GetResponseData("vnp_TransactionNo");
            var vnp_SecureHash = Request.Query["vnp_SecureHash"].ToString();
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_TransactionStatus = vnpay.GetResponseData("vnp_TransactionStatus");

            var vnp_HashSecret = _configuration["Vnpay:HashSecret"];
            if (string.IsNullOrEmpty(vnp_HashSecret)) return BadRequest("Missing Vnpay config");

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, vnp_HashSecret);

            if (checkSignature)
            {
                if (vnp_ResponseCode == "00" && vnp_TransactionStatus == "00")
                {
                    // Payment success, update order db
                    return Ok(new { message = "Giao dịch thành công", orderId = vnp_orderId });
                }
                else
                {
                    return BadRequest(new { message = "Giao dịch bị từ chối hoặc lỗi", orderId = vnp_orderId });
                }
            }
            else
            {
                return BadRequest("Invalid Signature");
            }
        }

        [HttpPost("create-payos-link")]
        public async Task<IActionResult> CreatePayOSLink([FromBody] PaymentRequestDto request)
        {
            try
            {
                var clientId = _configuration["PayOS:ClientId"];
                var apiKey = _configuration["PayOS:ApiKey"];
                var checksumKey = _configuration["PayOS:ChecksumKey"];

                if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(checksumKey))
                {
                    return BadRequest("PayOS configuration is missing.");
                }

                var payOSOptions = new PayOSOptions
                {
                    ClientId = clientId,
                    ApiKey = apiKey,
                    ChecksumKey = checksumKey
                };
                var payOS = new PayOSClient(payOSOptions);
                
                // Parse OrderId (e.g., ORD-1234 -> 1234). If parsing fails, use timestamp.
                long orderCode;
                var digitsOnly = new string(request.OrderId.Where(char.IsDigit).ToArray());
                if (string.IsNullOrEmpty(digitsOnly) || !long.TryParse(digitsOnly, out orderCode))
                {
                    orderCode = long.Parse(DateTimeOffset.Now.ToString("yyMMddHHmmss"));
                }

                // Append random digit to avoid duplicate order code testing issues
                orderCode = orderCode * 100 + new Random().Next(10, 99);

                var createPaymentLinkRequest = new PayOS.Models.V2.PaymentRequests.CreatePaymentLinkRequest
                {
                    OrderCode = orderCode,
                    Amount = (int)request.Amount,
                    Description = "Thanh toan " + request.OrderId,
                    Items = new List<PayOS.Models.V2.PaymentRequests.PaymentLinkItem>(),
                    CancelUrl = "http://localhost:5173/cart",
                    ReturnUrl = "http://localhost:5173/checkout/success"
                };

                var createPaymentResult = await payOS.PaymentRequests.CreateAsync(createPaymentLinkRequest);

                return Ok(new { url = createPaymentResult.CheckoutUrl });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
