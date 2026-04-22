using System;
using System.Reflection;
using System.Linq;

class Program
{
    static void Main()
    {
        var asm = Assembly.LoadFrom(@"C:\Users\ADMIN\.nuget\packages\payos\2.1.0\lib\net5.0\payOS.dll");
        var type = asm.GetType("PayOS.PayOSClient");
        foreach(var c in type.GetConstructors()) {
            Console.WriteLine("Constructor: " + string.Join(", ", c.GetParameters().Select(p => p.ParameterType.Name + " " + p.Name)));
        }
        foreach(var m in type.GetProperties()) {
            Console.WriteLine(m.PropertyType.Name + " " + m.Name);
        }
    }
}
