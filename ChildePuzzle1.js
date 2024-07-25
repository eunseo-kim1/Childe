import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PuzzleGame = () => {
  const [pieces, setPieces] = useState([]);
  const [completed, setCompleted] = useState(false);
  const gridSize = { rows: 4, cols: 4 };
  const containerSize = 400; // pixels

  useEffect(() => {
    const initializePuzzle = () => {
      const newPieces = Array(gridSize.rows * gridSize.cols).fill().map((_, index) => ({
        id: index,
        currentPosition: index,
        correctPosition: index,
        x: Math.random() * (window.innerWidth - 100),
        y: Math.random() * (window.innerHeight - 100),
        rotation: Math.random() * 360
      }));
      shufflePieces(newPieces);
    };

    initializePuzzle();
  }, []);

  const shufflePieces = (piecesArray) => {
    for (let i = piecesArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [piecesArray[i].currentPosition, piecesArray[j].currentPosition] = [piecesArray[j].currentPosition, piecesArray[i].currentPosition];
    }
    setPieces(piecesArray);
  };

  const handlePieceClick = (clickedPiece) => {
    const currentIndex = pieces.findIndex(piece => piece.currentPosition === clickedPiece.currentPosition);
    const correctIndex = pieces.findIndex(piece => piece.currentPosition === clickedPiece.correctPosition);
    
    const newPieces = [...pieces];
    [newPieces[currentIndex].currentPosition, newPieces[correctIndex].currentPosition] = 
    [newPieces[correctIndex].currentPosition, newPieces[currentIndex].currentPosition];
    
    newPieces[currentIndex].x = null;
    newPieces[currentIndex].y = null;
    newPieces[currentIndex].rotation = 0;
    
    setPieces(newPieces);
    checkCompletion(newPieces);
  };

  const checkCompletion = (piecesArray) => {
    const isCompleted = piecesArray.every(piece => piece.currentPosition === piece.correctPosition && piece.x === null);
    setCompleted(isCompleted);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#F5D0A9' }}>
      <h1 className="text-3xl font-bold mb-4">여우 생일일러 퍼즐 맞추기</h1>
      <div 
        className="relative grid gap-1 mb-4" 
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
          width: `${containerSize}px`,
          height: `${containerSize}px`
        }}
      >
        {pieces.map((piece) => (
          <div
            key={piece.id}
            onClick={() => handlePieceClick(piece)}
            className="bg-cover bg-center cursor-pointer transition-all duration-500 ease-in-out absolute"
            style={{
              backgroundImage: 'url("https://i.imgur.com/io0xQPY.png")',
              backgroundPosition: `${-(piece.correctPosition % gridSize.cols) * 100 / (gridSize.cols - 1)}% ${-Math.floor(piece.correctPosition / gridSize.cols) * 100 / (gridSize.rows - 1)}%`,
              width: `${containerSize / gridSize.cols}px`,
              height: `${containerSize / gridSize.rows}px`,
              left: piece.x !== null ? piece.x : `${(piece.currentPosition % gridSize.cols) * (100 / gridSize.cols)}%`,
              top: piece.y !== null ? piece.y : `${Math.floor(piece.currentPosition / gridSize.cols) * (100 / gridSize.rows)}%`,
              transform: piece.x !== null ? `rotate(${piece.rotation}deg)` : 'none',
              zIndex: piece.x !== null ? 10 : 1
            }}
          />
        ))}
      </div>
      {completed && (
        <Alert className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <AlertTitle className="text-2xl font-bold mb-4">축하합니다!</AlertTitle>
          <img src="https://i.imgur.com/zH5A9vz.png" alt="축하 이미지" className="w-40 h-40 mb-4 rounded-full object-cover" />
          <AlertDescription className="text-lg text-center">
            퍼즐을 완성하셨습니다!<br/>
            다음에는 탈종이 같은 일러스트에 나오기를 함께 기도해주세요.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PuzzleGame;
