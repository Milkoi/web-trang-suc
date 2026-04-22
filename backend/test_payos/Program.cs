using System;
using PayOS;
using PayOS.Models;

namespace test_payos
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Testing PayOS...");
            try {
                // Initialize PayOSClient
                var client = new PayOSClient("id", "key", "checksum");
                Console.WriteLine("Successfully created PayOSClient!");
            } catch (Exception ex) {
                Console.WriteLine("Error (though this is expected since creds are fake): " + ex.Message);
            }
        }
    }
}
