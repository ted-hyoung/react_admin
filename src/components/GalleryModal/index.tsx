import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { Modal, Carousel, Icon } from 'antd';
import './index.less';
interface Props {
  images: any[];
  currentIndex: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

function GalleryModal(props: Props) {
  const { images, currentIndex, visible, setVisible } = props;
  const carouselRef = useRef<Carousel>(null);

  const handlePrev = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  }, [carouselRef]);

  const handleNext = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  }, [carouselRef]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goTo(currentIndex);
    }
  }, [currentIndex, carouselRef]);

  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} wrapClassName="modal-gallery" forceRender footer={null}>
      <Carousel ref={carouselRef}>
        {images.map((image, i) => (
          <img key={'modal-gallery-' + i} src={image.src + '?text=' + (i + 1)} alt="" />
        ))}
      </Carousel>
      <Icon type="left" onClick={handlePrev} className="carousel-btn prev" />
      <Icon type="right" onClick={handleNext} className="carousel-btn next" />
    </Modal>
  );
}

export default GalleryModal;
