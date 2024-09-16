import React from 'react';
import { Container, Card, CardContent, Typography, Avatar, Box, IconButton, Chip, Button, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { styled } from '@mui/system';

// Contributor data with social media links and skills
const contributors = [
  {
    name: 'Himanshu Rai',
    role: 'Frontend Developer',
    imageUrl: '/assets/Himanshu_image.jpg',
    description: 'A passionate developer specializing in front-end technologies and designing amazing user experiences.',
    github: 'https://github.com/himanshu-rai',
    instagram: 'https://instagram.com/himanshu_rai',
    linkedin: 'https://linkedin.com/in/himanshu-rai',
    skills: ['React', 'JavaScript', 'CSS', 'UI/UX', 'TypeScript', 'Next JS'],
  },
  {
    name: 'Giriraj',
    role: 'Backend Developer',
    imageUrl: '/assets/Giriraj_image.jpg',
    description: 'An amazing backend developer specializing in providing functionality to pages.',
    github: 'https://github.com/Girirajbhatt',
    instagram: 'https://instagram.com/giriraj_dev',
    linkedin: 'https://linkedin.com/in/giriraj',
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Postman'],
  }
];

// Styled Card for hover effect
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
}));

const AboutUs = () => {
  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
          color: '#fff',
          padding: '4rem 0',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Meet Our Awesome Team
        </Typography>
        <Typography variant="h6" paragraph>
          We are a passionate group of developers who strive to create amazing user experiences and powerful functionalities.
        </Typography>
        {/* <Button
          variant="contained"
          color="secondary"
          href="#contact"
          sx={{ marginTop: '1rem' }}
        >
          Contact Us : 1234567890
        </Button> */}
      </Box>

      {/* About Us Section */}
      <Container maxWidth="lg" sx={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <Typography variant="h4" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Our team combines expertise from different areas, including front-end development, back-end development, and user interface design. We build experiences that delight users and provide powerful solutions.
        </Typography>

        <Stack direction="row" spacing={10} justifyContent="center" flexWrap="wrap">
          {contributors.map((contributor, index) => (
            <StyledCard key={index} sx={{ textAlign: 'center', padding: '1rem', maxWidth: 300, width: '100%' }}>
              <Box display="flex" justifyContent="center" mb={2}>
                <Avatar src={contributor.imageUrl} alt={contributor.name} sx={{ width: 100, height: 100 }} />
              </Box>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {contributor.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }} gutterBottom>
                  {contributor.role}
                </Typography>
                <Typography variant="body2" mb={2}>
                  {contributor.description}
                </Typography>

                {/* Skills Section */}
                <Box display="flex" justifyContent="center" flexWrap="wrap" mb={2}>
                  {contributor.skills.map((skill, idx) => (
                    <Chip key={idx} label={skill} color="primary" sx={{ margin: '4px' }} />
                  ))}
                </Box>

                {/* Social Media Links */}
                <Box display="flex" justifyContent="center">
                  {contributor.github && (
                    <IconButton
                      component="a"
                      href={contributor.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="tertiary"
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {contributor.instagram && (
                    <IconButton
                      component="a"
                      href={contributor.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="secondary"
                    >
                      <InstagramIcon />
                    </IconButton>
                  )}
                  {contributor.linkedin && (
                    <IconButton
                      component="a"
                      href={contributor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          ))}
        </Stack>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)', padding: '2rem 0' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" color='white' align="center" gutterBottom>
            What Our Clients Say
          </Typography>
          <Typography variant="body1" color='white' align="center" paragraph>
            We pride ourselves on delivering high-quality products that meet our clients' needs.
          </Typography>

          <Stack direction="row" spacing={4} justifyContent="center" flexWrap="wrap">
            {/* Testimonial 1 */}
            <Card sx={{ padding: '1rem', textAlign: 'center', maxWidth: 300, width: '100%' }}>
              <Typography variant="body1" paragraph>
                "The team was amazing to work with! They delivered everything we asked for and more. Highly recommended!"
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                - John Doe, CEO of ExampleCorp
              </Typography>
            </Card>

            {/* Testimonial 2 */}
            <Card sx={{ padding: '1rem', textAlign: 'center', maxWidth: 300, width: '100%' }}>
              <Typography variant="body1" paragraph>
                "Great communication and technical expertise. The project was a success thanks to their hard work."
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                - Sarah Lee, CTO of Tech Innovations
              </Typography>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default AboutUs;