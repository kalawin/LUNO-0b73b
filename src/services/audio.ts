/**
 * Audio Synthesizer service using Web Audio API
 * Generates pleasant feedback chimes without requiring external audio files
 */

class SoundService {
  private static getAudioContext(): AudioContext | null {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      return new AudioCtx();
    } catch {
      return null;
    }
  }

  /**
   * เล่นเสียงโน้ตคอร์ดขาขึ้น (C5 -> E5 -> G5 -> C6) เมื่อทำภารกิจสำเร็จหรือตอบถูกต้อง
   */
  static playSuccess(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.25); // C6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.debug('Audio synth fallback', e);
    }
  }

  /**
   * เล่นเสียงสัญญาณเตือน Sawtooth เมื่อตอบผิด หรือเกิดข้อผิดพลาด
   */
  static playError(): void {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.debug('Audio synth fallback', e);
    }
  }
}

export { SoundService };
