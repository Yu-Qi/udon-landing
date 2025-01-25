import { useEffect, useState, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import feature1 from './feature1.png';
import feature2 from './feature2.png';
import feature3 from './feature3.png';

function App() {
  const [floatingImages, setFloatingImages] = useState([]);
  const [rightFloatingImages, setRightFloatingImages] = useState([]);
  const [positionIndex, setPositionIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);

  // 定義固定的生成位置
  const SPAWN_POSITIONS = [
    { y: 30, angle: -15 }, // 位置1：稍微向上傾斜
    { y: 15, angle: -25 }, // 位置2：更大向上傾斜
    { y: 45, angle: 15 },  // 位置3：向下傾斜
    { y: 60, angle: 25 },  // 位置4：更大向下傾斜
  ];

  // 生成位置順序：2,1,2,3,4
  const SEQUENCE = [1, 0, 1, 2, 3];

  // 新增運動名稱陣列
  const EXERCISE_NAMES = [
    '槓鈴深蹲',
    '分腿蹲',
    '傳統硬舉',
    '史密斯臀推',
    '槓鈴臥推',
    '引體向上',
    '槓鈴肩推',
    '啞鈴二頭彎舉',
    '滑輪三頭下壓'
  ];

  // 新增特色圖片陣列
  const FEATURES = [
    feature1,
    feature2,
    feature3
  ];

  // 使用 useCallback 來記憶化 generateImages 函數
  const generateImages = useCallback(() => {
    const currentPosition = SEQUENCE[positionIndex];
    const currentExercise = EXERCISE_NAMES[exerciseIndex];
    
    const firstImage = {
      id: Date.now(),
      position: SPAWN_POSITIONS[currentPosition].y,
      initialY: `${SPAWN_POSITIONS[currentPosition].y}%`,
      angle: SPAWN_POSITIONS[currentPosition].angle,
      scale: 0.75,
      active: true,
      initialX: -10,
      delay: 0,
      exercise: currentExercise,
    };

    const secondImage = {
      id: Date.now() + 1,
      position: SPAWN_POSITIONS[currentPosition].y,
      initialY: `${SPAWN_POSITIONS[currentPosition].y}%`,
      angle: SPAWN_POSITIONS[currentPosition].angle,
      scale: 0.75,
      active: true,
      initialX: -10,
      delay: 0.05,
      exercise: currentExercise,
    };
    
    setFloatingImages(prev => [...prev, firstImage, secondImage]);
    setPositionIndex((positionIndex + 1) % SEQUENCE.length);
    setExerciseIndex((exerciseIndex + 1) % EXERCISE_NAMES.length);
  }, [positionIndex, exerciseIndex]);

  // 新增右側圖片生成函數
  const generateRightImage = useCallback(() => {
    const newImage = {
      id: Date.now(),
      scale: 0.9,
      initialAngle: Math.random() * 10 - 5,
      src: FEATURES[featureIndex],
    };
    
    setRightFloatingImages(prev => [...prev, newImage]);
    setFeatureIndex((prev) => (prev + 1) % FEATURES.length);
    console.log('Generating new image:', { featureIndex, src: FEATURES[featureIndex] });
  }, [featureIndex]);

  // 監聽右側圖片動畫結束
  const handleRightAnimationEnd = (id) => {
    setRightFloatingImages(prev => {
      const newImages = prev.filter(img => img.id !== id);
      
      // 如果沒有圖片了，立即生成新的
      if (newImages.length === 0) {
        generateRightImage();
      }
      return newImages;
    });
  };

  useEffect(() => {
    let interval;
    let cleanup;

    // 使用 Page Visibility API 來處理頁面可見性變化
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 當頁面隱藏時，清除所有計時器和浮動圖片
        clearInterval(interval);
        clearInterval(cleanup);
        setFloatingImages([]);
        setRightFloatingImages([]);
      } else {
        // 當頁面重新可見時，重新啟動計時器
        interval = setInterval(generateImages, 500);
        cleanup = setInterval(() => {
          setFloatingImages(prev => 
            prev.filter(img => {
              const element = document.getElementById(`float-${img.id}`);
              return element && !element.classList.contains('animation-completed');
            })
          );
        }, 5000);
        
        // 立即生成右側圖片
        setTimeout(() => {
          generateRightImage();
        }, 2000); // 2秒後才生成圖片
              }
    };

    // 初始設置計時器
    interval = setInterval(generateImages, 500);
    cleanup = setInterval(() => {
      setFloatingImages(prev => 
        prev.filter(img => {
          const element = document.getElementById(`float-${img.id}`);
          return element && !element.classList.contains('animation-completed');
        })
      );
    }, 5000);

    // 註冊 visibility change 事件監聽器
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      clearInterval(cleanup);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [generateImages, generateRightImage]);

  // 為了追蹤 positionIndex 的變化，我們可以加入一個 useEffect
  useEffect(() => {
    // console.log("Position Index updated:", positionIndex);
  }, [positionIndex]);

  // 處理圖片碰撞效果
  const handleCollision = (id) => {
    setFloatingImages(prev => prev.filter(img => img.id !== id));
  };

  // 初始化右側圖片
  useEffect(() => {
    generateRightImage();
    
    // 添加清理函數
    return () => {
      setRightFloatingImages([]);
      setFeatureIndex(0);
    };
  }, []); // 移除 generateRightImage 依賴

  return (
    <div className="App">
      <div className="hero-section">
        <h1>過年送什麼好呢?<br />免費的健身App - Udon</h1>
        <p className="subtitle">
         保持健康、練出好身材，讓健身成為最棒的新年禮物！
        </p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => window.open('https://udon-fitness.onelink.me/aBlL/mz14tqiu', '_blank')}>
            立即下載
          </button>
          <button className="btn-secondary" onClick={() => window.open('https://www.instagram.com/udon.fitness?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank')}>
            IG 粉專
          </button>
        </div>
      </div>

      <div className="animation-container">
        {floatingImages.map(img => (
          <div
            key={img.id}
            id={`float-${img.id}`}
            className="floating-image"
            style={{
              '--initial-x': `${img.initialX}%`,
              '--initial-y': img.initialY,
              '--scale': img.scale,
              '--delay': `${img.delay}s`,
              '--angle': `${img.angle}deg`,
            }}
            onClick={() => handleCollision(img.id)}
            onAnimationEnd={(e) => {
              e.target.classList.add('animation-completed');
            }}
          >
            {img.exercise}
          </div>
        ))}

        {rightFloatingImages.map(img => (
          <div
            key={img.id}
            className="right-floating-image"
            style={{
              '--scale': img.scale,
              '--initial-angle': `${img.initialAngle}deg`,
            }}
            onAnimationEnd={() => handleRightAnimationEnd(img.id)}
          >
            <img src={img.src} alt="Feature" />
          </div>
        ))}

        <div className="center-logo">
          <img src={logo} alt="Center Logo" />
        </div>
      </div>
    </div>
  );
}

export default App;
