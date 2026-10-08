import { useCallback, useEffect, useRef } from 'react';

export function useAudio(src: string, volume = 1): () => void {
   const audioRef = useRef<HTMLAudioElement | null>(null);

   useEffect(() => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = volume;
      audioRef.current = audio;

      return () => {
         audio.pause();
         audioRef.current = null;
      };
   }, [src, volume]);

   return useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = 0;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
         playPromise.catch(() => {
            // Autoplay policy: the browser blocked playback because
            // no user gesture has unlocked audio on this page yet.
         });
      }
   }, []);
}
