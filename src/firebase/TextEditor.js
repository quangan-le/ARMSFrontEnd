import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import uploadImage from './uploadImage'


// Hàm xử lý tải ảnh lên Firebase và nhúng vào editor
const handleImageUpload = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
      const file = input.files[0];

      try {
          // Tải ảnh lên Firebase với thư mục 'BlogDetail' 
          const imageUrl = await uploadImage(file, 'BlogDetail');
          
          // Nhúng URL ảnh vào editor
          const quill = Quill.find(document.querySelector('.ql-editor'));
          const range = quill.getSelection();
          quill.editor.insertEmbed(range.index, 'image', imageUrl);
      } catch (error) {
          console.error('Error uploading image:', error);
      }
  };
};

const modules = {
  toolbar: {
    container: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      image: handleImageUpload
    }
  }
};


const TextEditor = ({ value, onChange }) => {
  return (
      <ReactQuill 
          value={value}
          onChange={onChange}
          modules={modules} 
      />
  );
};

export default TextEditor;
