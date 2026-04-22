using System;
using System.Reflection;

class Program
{
    static void Main()
    {
        var asm = Assembly.LoadFrom(@"C:\Users\ADMIN\.nuget\packages\payos\2.1.0\lib\net5.0\payOS.dll");
        var type = asm.GetType("PayOS.Models.V2.PaymentRequests.PaymentLinkStatus");
        if(type!=null){
            foreach(var name in Enum.GetNames(type)) Console.WriteLine(name);
        }
    }
}
