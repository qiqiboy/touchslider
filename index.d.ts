// Type definitions for touchslider>=2.1.0
// Project: TouchSlider
// Definitions by: qiqiboy

declare const TouchSlider: TouchSlider.TouchSliderConstructor;

export = TouchSlider;

export as namespace TouchSlider;

declare namespace TouchSlider {
    interface TouchSliderConfig {
        duration?: number;
        direction?: 0 | 1;
        start?: number;
        loop?: boolean;
        mouse?: boolean;
        mousewheel?: boolean;
        interval?: number;
        autoplay?: number;
        arrowkey?: boolean;
        freeze?: boolean;
        fullsize?: boolean;
        align?: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
    }

    interface TouchSlider {
        pages: HTMLElement[];
        length: number;
        arrowkey: boolean;
        playing: boolean;
        interval: number;
        mousewheel: boolean;
        mouse: boolean;
        loop: boolean;
        current: number;
        direction: 0 | 1;
        duration: number;

        prev(): TouchSlider;
        next(): TouchSlider;
        slide(index: number): TouchSlider;
        play(): TouchSlider;
        pause(): TouchSlider;

        resize(): TouchSlider;
        isStatic(): boolean;

        prepend(page: HTMLElement): TouchSlider;
        append(page: HTMLElement): TouchSlider;
        insertBefore(page: HTMLElement, index: number): TouchSlider;
        insertAfter(page: HTMLElement, index: number): TouchSlider;
        remove(index: number): TouchSlider;

        on(action: 'before', callback: (current: number, next: number) => void): TouchSlider;
        on(action: 'after', callback: (current: number, prev: number) => void): TouchSlider;
        on(action: 'dragStart' | 'drageMove' | 'dragEnd', callback: (event: any) => void): TouchSlider;

        destroy(): TouchSlider;
    }

    interface TouchSliderConstructor {
        new (idOrElement: string | HTMLElement, config?: TouchSliderConfig): TouchSlider;
        (idOrElement: string | HTMLElement, config?: TouchSliderConfig): TouchSlider;
    }
}
