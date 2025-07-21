import Image from 'next/image';

export default function Banner({ src, title }) {
  const images = [
    '/img/banners/1.jpg',
    '/img/banners/2.jpg',
    '/img/banners/3.jpg',
    '/img/banners/4.jpg',
    '/img/banners/5.jpg',
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];
  const imageSrc = src || randomImage;

  return (
    <div className="cont">
      <Image
        src={imageSrc}
        alt="banner"
        width={800}
        height={320}
        style={{
          width: '100%',
          height: '20rem',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      {title && <span>{title}</span>}
    </div>
  );
}
