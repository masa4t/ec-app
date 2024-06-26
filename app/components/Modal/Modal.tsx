import React from "react";
import "./modal.scss";

interface ModalProps {
  imageUrls: string[] | undefined;
  setIsModalOpen: (isOpen: boolean) => void;
}

const Modal = ({ imageUrls, setIsModalOpen }: ModalProps) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="modal">
        <div className="removeModal">
          <button onClick={closeModal}>×</button>
        </div>

        {imageUrls?.map((image, index) => (
          <img src={image} key={index} />
        ))}
      </div>
    </>
  );
};

export default Modal;
