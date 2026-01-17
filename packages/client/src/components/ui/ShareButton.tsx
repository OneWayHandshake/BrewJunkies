import { useState } from 'react';
import { Share2, Twitter, Facebook, Link, Check, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './Dialog';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${title} - ${text}`);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Twitter / X',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      color: 'hover:bg-[#4267B2]/10 hover:text-[#4267B2]',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      color: 'hover:bg-[#25D366]/10 hover:text-[#25D366]',
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openShareLink = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
            <DialogDescription>
              Share this coffee with your friends and fellow coffee lovers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Social share buttons */}
            <div className="flex justify-center gap-4">
              {shareLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => openShareLink(link.url)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${link.color}`}
                  title={`Share on ${link.name}`}
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <link.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs">{link.name}</span>
                </button>
              ))}
            </div>

            {/* Copy link */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm truncate">
                {shareUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0 gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
