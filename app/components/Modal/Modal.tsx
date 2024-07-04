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
    <div className="modal">
      <button className="removeModal" onClick={closeModal}>
        ×
      </button>
      {imageUrls?.map((image, index) => (
        <img src={image} key={index} alt={`Modal image ${index}`} />
      ))}
    </div>
  );
};

export default Modal;
