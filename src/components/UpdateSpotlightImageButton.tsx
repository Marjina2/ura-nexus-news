
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSerpApi } from '@/hooks/useSerpApi';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw } from 'lucide-react';

const QUERY = 'Gujarat plane crash';

const UpdateSpotlightImageButton = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { searchImages } = useSerpApi();

  const handleClick = async () => {
    setLoading(true);
    setDone(false);
    setError(null);
    try {
      const serpApiKey = localStorage.getItem('serpApiKey');
      if (!serpApiKey) throw new Error('No SerpAPI key in localStorage');
      const images = await searchImages(QUERY, serpApiKey);
      if (!images || !images[0]?.original) throw new Error('No relevant image found');
      const imageUrl = images[0].original;

      // Patch latest spotlight for today
      const today = new Date().toISOString().slice(0, 10);
      const { error: updateError } = await supabase
        .from('spotlight_news')
        .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
        .eq('date', today);

      if (updateError) throw updateError;
      setDone(true);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 flex gap-3">
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={loading}
        className="border-red-400 text-red-400"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Update Spotlight Image from SerpAPI
      </Button>
      {done && <span className="text-green-500">Updated!</span>}
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default UpdateSpotlightImageButton;
