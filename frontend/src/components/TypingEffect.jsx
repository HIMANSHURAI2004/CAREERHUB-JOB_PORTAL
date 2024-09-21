import TypingEffect from 'react-typing-effect';

const TypingEffectComponent = () => (
  <h1 className="text-3xl lg:text-6xl ">
    <TypingEffect
      text={['Over 10K+ jobs are waiting for you', 'Find your dream job today', 'Make your dream career a reality']}
      speed={100}
      eraseDelay={2000}
      typingDelay={1000}
      cursorRenderer={(cursor) => <h1 className='text-blue-600'>{cursor}</h1>}
    />
  </h1>
);

export default TypingEffectComponent;
