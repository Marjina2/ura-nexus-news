
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-ura-black">
      <Header />
      
      <main className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contact <span className="gradient-text">URA</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about our platform? Want to partner with us? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-morphism p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-ura-white mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-background border-border focus:border-ura-green"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-background border-border focus:border-ura-green"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="bg-background border-border focus:border-ura-green"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-background border-border focus:border-ura-green min-h-32"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-ura-green text-ura-black hover:bg-ura-green-hover">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-ura-green mr-3" />
                  <h3 className="text-xl font-bold text-ura-white">Email</h3>
                </div>
                <p className="text-muted-foreground mb-2">General inquiries:</p>
                <p className="text-ura-white">hello@ura.news</p>
                <p className="text-muted-foreground mb-2 mt-4">Business partnerships:</p>
                <p className="text-ura-white">business@ura.news</p>
                <p className="text-muted-foreground mb-2 mt-4">Support:</p>
                <p className="text-ura-white">support@ura.news</p>
              </div>

              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-ura-green mr-3" />
                  <h3 className="text-xl font-bold text-ura-white">Phone</h3>
                </div>
                <p className="text-muted-foreground mb-2">Business hours (IST):</p>
                <p className="text-ura-white">+91 98765 43210</p>
                <p className="text-muted-foreground text-sm mt-2">Monday - Friday, 9:00 AM - 6:00 PM</p>
              </div>

              <div className="glass-morphism p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-ura-green mr-3" />
                  <h3 className="text-xl font-bold text-ura-white">Office</h3>
                </div>
                <p className="text-ura-white">URA Labs Pvt. Ltd.</p>
                <p className="text-muted-foreground">
                  Tech Hub, Cyber City<br />
                  Bangalore, Karnataka 560001<br />
                  India
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
