import { Linkedin, Twitter, Github, Mail, Phone, MapPin, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-[#0f1a40] text-white relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white/90 rounded"></div>
              </div>
              <span className="text-2xl font-bold text-white">
                Financial<span className="text-primary">Advisor</span>
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Empowering your financial future with smart planning, personalized insights, and expert guidance every step of the way.
            </p>
            <div className="flex space-x-3">
              {[Linkedin, Twitter, Github].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-white/10 text-white/70 hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center backdrop-blur-sm"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="font-semibold text-white text-lg relative inline-block">
              Services
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {["Financial Planning", "Investment Advisory", "Retirement Planning", "Tax Optimization", "Wealth Management", "Estate Planning"].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-sm text-white/70 hover:text-primary transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-6">
            <h4 className="font-semibold text-white text-lg relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "#about" },
                { name: "Our Team", href: "#team" },
                { name: "Careers", href: "#careers" },
                { name: "Blog", href: "#blog" },
                { name: "Contact Us", href: "#contact" },
                { name: "Partner With Us", href: "#partners" }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm text-white/70 hover:text-primary transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="font-semibold text-white text-lg relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <p className="text-sm text-white/70">
              Subscribe to our newsletter for financial tips and market insights.
            </p>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:border-primary backdrop-blur-sm"
                />
                <Button size="icon" className="bg-primary hover:bg-primary/90 shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 pt-4">
                <h5 className="text-sm font-medium text-white">Contact Info</h5>
                <div className="space-y-2">
                  <a href="tel:+1234567890" className="flex items-center text-sm text-white/70 hover:text-primary transition-colors group">
                    <Phone className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    +1 (234) 567-890
                  </a>
                  <a href="mailto:info@financialadvisor.com" className="flex items-center text-sm text-white/70 hover:text-primary transition-colors group">
                    <Mail className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    info@financialadvisor.com
                  </a>
                  <div className="flex items-start text-sm text-white/70">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                    <span>123 Finance Street, Suite 100, New York, NY 10001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/70 text-center md:text-left">
              © {new Date().getFullYear()} FinancialAdvisor. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#privacy" className="text-sm text-white/70 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-sm text-white/70 hover:text-primary transition-colors">Terms of Service</a>
              <a href="#cookies" className="text-sm text-white/70 hover:text-primary transition-colors">Cookie Policy</a>
              <a href="#accessibility" className="text-sm text-white/70 hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
