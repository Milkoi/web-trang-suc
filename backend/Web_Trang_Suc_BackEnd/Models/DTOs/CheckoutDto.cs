namespace web_Trang_suc_BE.Models.DTOs
{
    public class ShippingAddressDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Company { get; set; }
        public string Address { get; set; } = string.Empty;
        public string? Apartment { get; set; }
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }

    public class PaymentInfoDto
    {
        public string Method { get; set; } = string.Empty;
    }

    public class CheckoutDto
    {
        public string Email { get; set; } = string.Empty;
        public bool NewsletterOptin { get; set; }
        public ShippingAddressDto Shipping { get; set; } = new();
        public string ShippingMethod { get; set; } = string.Empty;
        public PaymentInfoDto Payment { get; set; } = new();
    }
}
