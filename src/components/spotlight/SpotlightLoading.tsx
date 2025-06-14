
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Zap, RefreshCw } from 'lucide-react';

interface SpotlightLoadingProps {
  progress: number;
}

const SpotlightLoading = ({ progress }: SpotlightLoadingProps) => {
  return (
    <section className="relative py-8 bg-gradient-to-br from-red-900/30 via-orange-900/20 to-yellow-900/10 border border-red-500/20 rounded-2xl mb-8 overflow-hidden">
      <div className="absolute inset-0 opacity-10 animate-pulse bg-grid" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-red-500/30 mx-auto">
              <Zap className="w-8 h-8 text-red-400 animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping mx-auto" />
          </div>
          
          <h3 className="text-2xl font-bold text-ura-white mb-4">
            Generating Fresh Spotlight
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            AI is analyzing current events to bring you the most important news of the moment
          </p>
          
          <div className="max-w-md mx-auto space-y-4">
            <Progress value={progress} className="h-3 bg-red-900/30" />
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing latest developments...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpotlightLoading;
