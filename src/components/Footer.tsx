
import React from 'react';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-ura-white mb-4">
              Stay Updated with <span className="text-ura-green">URA</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Get the latest AI-enhanced news and exclusive creator content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border-border focus:border-ura-green"
              />
              <Button className="bg-ura-green text-ura-black hover:bg-ura-green-hover">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-ura-green rounded-lg flex items-center justify-center">
                  <span className="text-ura-black font-bold text-lg">U</span>
                </div>
                <span className="text-2xl font-bold gradient-text">URA</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Smart, AI-curated news for modern readers. Transforming how you 
                consume and create content with cutting-edge technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-ura-green transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-ura-green transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-ura-green transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-ura-green transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.407-5.965 1.407-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-ura-white mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/" className="text-muted-foreground hover:text-ura-green transition-colors">Home</a></li>
                <li><a href="/trending" className="text-muted-foreground hover:text-ura-green transition-colors">Trending</a></li>
                <li><a href="/categories" className="text-muted-foreground hover:text-ura-green transition-colors">Categories</a></li>
                <li><a href="/ai-picks" className="text-muted-foreground hover:text-ura-green transition-colors">AI Picks</a></li>
                <li><a href="/search" className="text-muted-foreground hover:text-ura-green transition-colors">Search</a></li>
              </ul>
            </div>

            {/* For Creators */}
            <div>
              <h4 className="font-semibold text-ura-white mb-4">For Creators</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/pricing" className="text-muted-foreground hover:text-ura-green transition-colors">Pricing Plans</a></li>
                <li><a href="/licensing" className="text-muted-foreground hover:text-ura-green transition-colors">Content Licensing</a></li>
                <li><a href="/api" className="text-muted-foreground hover:text-ura-green transition-colors">API Access</a></li>
                <li><a href="/analytics" className="text-muted-foreground hover:text-ura-green transition-colors">Usage Analytics</a></li>
                <li><a href="/community" className="text-muted-foreground hover:text-ura-green transition-colors">Creator Community</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-ura-white mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="/about" className="text-muted-foreground hover:text-ura-green transition-colors">About URA</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-ura-green transition-colors">Contact Us</a></li>
                <li><a href="/help" className="text-muted-foreground hover:text-ura-green transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="text-muted-foreground hover:text-ura-green transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-muted-foreground hover:text-ura-green transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 URA Labs. All rights reserved.
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Powered by AI</span>
              <span>•</span>
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 mx-1" />
              <span>by URA Labs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
