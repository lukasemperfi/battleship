type Status = "loaded" | "error";

const originalImage = window.Image;

interface MockImageReturn {
  simulate: (value: Status) => void;
  restore: () => void;
}

export function mockImage(): MockImageReturn {
  let status: Status;

  class Image {
    onload: VoidFunction = () => {
      console.log("called");
    };

    onerror: VoidFunction = () => {};
    src = "";
    alt = "";

    constructor() {
      setTimeout(() => {
        if (status === "error") {
          this.onerror();
        } else {
          this.onload();
        }
      }, mockImage.DELAY);
      return this;
    }
  }

  // @ts-expect-error
  window.Image = Image;

  return {
    simulate(value: Status) {
      status = value;
    },

    restore() {
      window.Image = originalImage;
    },
  };
}

mockImage.restore = () => {
  window.Image = originalImage;
};

mockImage.DELAY = 100;
