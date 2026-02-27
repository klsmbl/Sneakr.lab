import React from 'react';
import './AnimatedBackground.css';
import sneakerIcon from '../assets/sneakers.png';
import sneakerIcon2 from '../assets/sneakers 2.png';
import sneakerIcon3 from '../assets/sneaker 3.png';

export function AnimatedBackground() {
  // Array of all sneaker images
  const sneakerImages = [sneakerIcon, sneakerIcon2, sneakerIcon3];
  
  // Generate pattern items with random rotations and random sneaker images
  const patternItems = [];
  const rows = 12;
  const cols = 16;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const randomRotation = Math.random() * 20 - 10; // -10 to +10 degrees
      const randomSneaker = sneakerImages[Math.floor(Math.random() * sneakerImages.length)];
      patternItems.push({
        id: `${row}-${col}`,
        rotation: randomRotation,
        sneaker: randomSneaker,
        row,
        col
      });
    }
  }

  return (
    <div className="animated-background">
      <div className="animated-background__pattern">
        {patternItems.map(item => (
          <div
            key={item.id}
            className="animated-background__item"
            style={{
              '--rotation': `${item.rotation}deg`,
              '--row': item.row,
              '--col': item.col
            }}
          >
            <img src={item.sneaker} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
