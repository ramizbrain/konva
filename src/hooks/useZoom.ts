import { useEffect, useRef, useState } from "react";

export function useZoom(wrapperRef: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  const initialDistance = useRef<number | null>(null);
  const initialScale = useRef<number>(1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Menghitung jarak antara dua titik sentuhan
    const getDistance = (touches: TouchList): number => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Variabel untuk melacak apakah sedang dalam mode pinch zoom
    let isPinching = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Hanya cegah default jika memang pinch zoom
        e.preventDefault();
        isPinching = true;
        const distance = getDistance(e.touches);
        initialDistance.current = distance;
        initialScale.current = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (
        e.touches.length === 2 &&
        initialDistance.current !== null &&
        isPinching
      ) {
        // Cegah scroll saat pinch zoom
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const scaleFactor = currentDistance / initialDistance.current;
        const newScale = Math.max(
          0.1,
          Math.min(3, initialScale.current * scaleFactor)
        );
        setScale(newScale);
      }
    };

    const handleTouchEnd = () => {
      initialDistance.current = null;
      isPinching = false;
    };

    // Tambahkan wheel zoom untuk testing di desktop
    const handleWheel = (e: WheelEvent) => {
      // Gunakan Ctrl+Wheel untuk zoom
      if (e.ctrlKey) {
        e.preventDefault();
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom out/in
        const newScale = Math.max(0.1, Math.min(3, scale * scaleFactor));
        setScale(newScale);
      }
    };

    // Pasang event listener pada wrapper
    wrapper.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    wrapper.addEventListener("touchmove", handleTouchMove, { passive: false });
    wrapper.addEventListener("touchend", handleTouchEnd);
    wrapper.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      wrapper.removeEventListener("touchstart", handleTouchStart);
      wrapper.removeEventListener("touchmove", handleTouchMove);
      wrapper.removeEventListener("touchend", handleTouchEnd);
      wrapper.removeEventListener("wheel", handleWheel);
    };
  }, [scale, wrapperRef]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  return { scale, zoomIn, zoomOut };
}
