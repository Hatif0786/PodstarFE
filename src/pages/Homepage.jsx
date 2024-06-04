import React from 'react';
import styled from 'styled-components';
import heroImage from '../Images/hero-image.jpg';
import podcastImage from "../Images/podcast-image.jpg"
import { Link } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
`;

const HeroSection = styled.div`
  width: 100%;
  min-height: calc(100vh - 60px); /* Adjust based on your navbar height */
  background: url(${podcastImage}) no-repeat center center;
  background-size: cover; /* Ensures the image covers the full width */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 2s ease-in-out;

  @media (max-width: 768px) {
    min-height: 70vh; /* Adjust the height as needed */
  }

  @media (max-width: 480px) {
    min-height: 60vh; /* Adjust the height as needed */
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// Rest of the styled components remain unchanged...

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
  background: transparent; // Set the background to transparent
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
    color: white// Semi-transparent on hover
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


const ContentSection = styled.div`
  width: 80%;
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 90%;
    margin: 30px auto; /* Slightly reduce vertical margin for tablets */
  }

  @media (max-width: 480px) {
    width: 95%;
    margin: 20px auto; /* Further reduce vertical margin for mobiles */
  }
`;

// Rest of the styled components remain unchanged...


const SectionHeader = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
  animation: fadeInLeft 1.5s ease-in-out;
  
  @keyframes fadeInLeft {
    from { transform: translateX(-30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const PodcastGrid = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PodcastCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 300px;
  animation: fadeInRight 1.5s ease-in-out;

  @media (max-width: 768px) {
    width: 45%; /* Adjust card width for tablet view */
  }

  @media (max-width: 480px) {
    width: 100%; /* Full width cards for mobile view */
  }
`;


const PodcastImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;

  @media (max-width: 480px) {
    height: 150px;
  }
`;

const PodcastContent = styled.div`
  padding: 15px;
`;

const PodcastTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const PodcastDescription = styled.p`
  font-size: 1rem;
  color: #666;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Homepage = () => {
  return (
    <Container>
      <HeroSection>
        <HeroText>
          Welcome to Podstar
        </HeroText>
        <Button to="/signup">
          Get Started
        </Button>
      </HeroSection>
      <ContentSection>
        <SectionHeader>Popular Podcasts</SectionHeader>
        <PodcastGrid>
          <PodcastCard>
            <PodcastImage src={heroImage} alt="Podcast" />
            <PodcastContent>
              <PodcastTitle>Podcast Title</PodcastTitle>
              <PodcastDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </PodcastDescription>
            </PodcastContent>
          </PodcastCard>
          {/* Add more PodcastCards as needed */}
        </PodcastGrid>
      </ContentSection>
    </Container>
  );
};

export default Homepage;
