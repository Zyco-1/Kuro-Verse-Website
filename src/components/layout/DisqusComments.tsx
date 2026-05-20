'use client';

import { useEffect } from 'react';

interface DisqusProps {
  shortname: string;
  config: {
    url: string;
    identifier: string;
    title: string;
  };
}

export default function DisqusComments({ shortname, config }: DisqusProps) {
  useEffect(() => {
    const d = document;
    const s = d.createElement('script');
    s.src = `https://${shortname}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', (+new Date()).toString());

    // Ensure DISQUS exists before calling reset
    if ((window as any).DISQUS) {
      (window as any).DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = config.identifier;
          this.page.url = config.url;
          this.page.title = config.title;
        },
      });
    } else {
      (window as any).disqus_config = function () {
        this.page.identifier = config.identifier;
        this.page.url = config.url;
        this.page.title = config.title;
      };
      if (!d.getElementById('disqus-embed-script')) {
        s.id = 'disqus-embed-script';
        (d.head || d.body).appendChild(s);
      }
    }
  }, [config, shortname]);

  return (
    <div className="mt-12 bg-white/5 p-8 rounded-2xl border border-white/5 shadow-2xl">
      <div id="disqus_thread"></div>
    </div>
  );
}
