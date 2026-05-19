'use client';

import { useEffect } from 'react';

interface DisqusCommentsProps {
  shortname: string;
  config: {
    url: string;
    identifier: string;
    title: string;
  };
}

export default function DisqusComments({ shortname, config }: DisqusCommentsProps) {
  useEffect(() => {
    const d = document, s = d.createElement('script');
    s.src = `https://${shortname}.disqus.com/embed.js`;
    s.setAttribute('data-timestamp', new Date().toString());
    (d.head || d.body).appendChild(s);

    (window as any).disqus_config = function () {
      this.page.url = config.url;
      this.page.identifier = config.identifier;
      this.page.title = config.title;
    };
  }, [shortname, config]);

  return <div id="disqus_thread" className="mt-12 bg-white/5 p-8 rounded-2xl border border-white/5" />;
}
