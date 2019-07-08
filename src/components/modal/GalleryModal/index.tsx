import React, { useEffect, useRef, useCallback } from 'react';
import { Modal, Carousel, Icon } from 'antd';
import './index.less';
import { ModalOptions, GalleryModalContent } from 'types';

interface Props extends ModalOptions {
  content: GalleryModalContent;
  visible: boolean;
}

function GalleryModal(props: Props) {
  const { content } = props;
  const { images, currentIndex } = content;
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
    if (carouselRef.current && currentIndex) {
      console.log(currentIndex, carouselRef);
      carouselRef.current.goTo(currentIndex);
    }
  }, [currentIndex, carouselRef]);
  return (
    <Modal {...props} wrapClassName="modal-gallery" footer={null} forceRender>
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
