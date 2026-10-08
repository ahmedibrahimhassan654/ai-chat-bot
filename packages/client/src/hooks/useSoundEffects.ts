import { useCallback, useEffect, useState } from 'react';
import notificationSound from '@/assets/notification.mp3';
import popSound from '@/assets/pop.mp3';
import { useAudio } from './useAudio';

const SOUND_PREFERENCE_KEY = 'wonderworld-sound-enabled';

function readStoredPreference(): boolean {
   if (typeof window === 'undefined') return true;

   try {
      return window.localStorage.getItem(SOUND_PREFERENCE_KEY) !== 'off';
   } catch {
      return true;
   }
}

export function useSoundEffects() {
   const [isMuted, setIsMuted] = useState<boolean>(
      () => !readStoredPreference()
   );

   const playPop = useAudio(popSound);
   const playNotification = useAudio(notificationSound);

   useEffect(() => {
      try {
         window.localStorage.setItem(
            SOUND_PREFERENCE_KEY,
            isMuted ? 'off' : 'on'
         );
      } catch {
         // Storage is unavailable (e.g. private mode) — ignore.
      }
   }, [isMuted]);

   const playSend = useCallback(() => {
      if (!isMuted) playPop();
   }, [isMuted, playPop]);

   const playReceive = useCallback(() => {
      if (!isMuted) playNotification();
   }, [isMuted, playNotification]);

   const toggleMuted = useCallback(() => setIsMuted((prev) => !prev), []);

   return { playSend, playReceive, isMuted, toggleMuted };
}
