import React from 'react';
import styled, { keyframes } from 'styled-components';
import heroImage from '../Images/hero-image.png';
import podcastImage from '../Images/podcast-image.jpg';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const videoFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(1.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const wrapperFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
`;

const HeroSection = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px);
  background: url(${podcastImage}) no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 2s ease-in-out;

  @media (max-width: 768px) {
    min-height: 70vh;
  }

  @media (max-width: 480px) {
    min-height: 60vh;
  }
`;

const HeroText = styled.div`
  color: white;
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;

  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 15px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    padding: 10px;
  }
`;

const Button = styled(Link)`
  background: transparent;
  color: #be1adb;
  padding: 15px 30px;
  border: 2px solid #be1adb;
  border-radius: 30px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
  animation: fadeOut 2s ease-in-out;

  &:hover {
    border: none;
    background: #be1adb;
    color: white;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 0.5; }
  }

  @media (max-width: 768px) {
    padding: 12px 25px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 85%;
  background-color: ${({ theme }) => theme.bgLight};
  padding-left: 10%;
  padding-right: 10%;
  opacity: 0;
  transform: translateY(20px);
  animation: ${({ inView }) => (inView ? fadeIn : 'none')} 1.5s ease-in-out forwards;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    padding: 5% 10%;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  padding: 20px;

  @media (max-width: 768px) {
    text-align: center;
    padding: 10px;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 30px;
  margin-bottom: 80px;

  @media (max-width: 576px) {
    margin-top: 10px;
    margin-bottom: 20px;
  }
`;

const InfoImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  position: relative;
  z-index: 1;
`;

const VideoWrapper = styled.div`
  width: 100%;
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (9 / 16 * 100) */
  overflow: hidden;
  animation: ${({ inView }) => (inView ? wrapperFadeIn : 'none')} 2s ease-in-out;

  @media (max-width: 768px) {
    padding-top: 75%; /* Adjust for different aspect ratios or preferences */
    margin-bottom: 30%;
  }
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Adjust overlay color and opacity */
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const OverlayText = styled.p`
  color: white;
  font-style: italic;
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.2rem;
  max-width: 80%;
  padding: 20px;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: ${({ inView }) => (inView ? videoFadeIn : 'none')} 2s ease-in-out;
`;

const Homepage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <Container id="content">
      <HeroSection>
        <HeroText>
          Welcome to Podstar
        </HeroText>
        <Button to="/login">
          Get Started
        </Button>
      </HeroSection>
      <InfoSection ref={ref} inView={inView}>
        <TextContainer>
          <p style={{ fontSize: "2.5rem", fontWeight: "bold" }}>About Podstar</p>
          <p>
            Podstar is your ultimate destination for discovering and enjoying the best podcasts.
            Our application provides a seamless experience to explore, listen, and share your favorite podcasts.
            Join us and become a part of the Podstar community today! With Podstar, you can follow your favorite
            podcast creators and stay updated with the latest episodes. Discover new shows tailored to your interests
            and dive into a world of engaging content. Our user-friendly interface and advanced features make it easy
            to create playlists, download episodes for offline listening, and interact with a community of podcast enthusiasts.
          </p>
        </TextContainer>
        <ImageContainer>
          <InfoImage src={heroImage} alt="Podstar Application" />
        </ImageContainer>
      </InfoSection>
      <VideoWrapper>
        <VideoOverlay>
          <OverlayText>
            "Discover new worlds of storytelling with Podstar. Your gateway to immersive podcasts that spark imagination and stir the soul. Tune in, and let the stories unfold."
          </OverlayText>
        </VideoOverlay>
        <Video
          src="https://res.cloudinary.com/doi88vbcz/video/upload/v1720454586/8043623-uhd_4096_2160_25fps_nxqsvu.mp4"
          autoPlay
          loop
          muted
          playsInline
          inView={inView}
        />
      </VideoWrapper>
    </Container>
  );
};

export default Homepage;
