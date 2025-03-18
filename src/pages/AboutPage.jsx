import React from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import Footer from "../components/Footer";
import Navebar from "../components/Navebar";

const AboutPage = () => {
  return (
    <div className="bg-white">
      <Navebar />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 8, font: "bold" }}>
          <h1 className=" text-5xl font-extrabold text-blue-900">
            Welcome to Vista
          </h1>
          <Typography variant="h5" color="textSecondary">
            Cutting-Edge Software Solutions for a Digital World
          </Typography>
        </Box>

        {/* Company Overview */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Who We Are
          </Typography>
          <Typography variant="body1" paragraph>
            Vista is a leading software development company dedicated to
            creating innovative desktop apps, mobile apps, websites, and web
            applications. With a passion for technology and a commitment to
            excellence, we turn ideas into reality.
          </Typography>
          <Typography variant="body1" paragraph>
            Our team of senior developers and experienced professionals works
            collaboratively to achieve any task, ensuring that every solution is
            robust, scalable, and designed with the future in mind.
          </Typography>
        </Box>

        {/* Services Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Our Services
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              justifyContent: "center",
            }}
          >
            <Card sx={{ height: "100%", width: 300 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200?text=Desktop+Apps"
                alt="Desktop Apps"
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  Desktop Apps
                </Typography>
                <Typography variant="body2">
                  Powerful and efficient desktop applications built to perform.
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ height: "100%", width: 300 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200?text=Mobile+Apps"
                alt="Mobile Apps"
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  Mobile Apps
                </Typography>
                <Typography variant="body2">
                  Engaging and intuitive mobile apps for iOS and Android.
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ height: "100%", width: 300 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200?text=Websites"
                alt="Websites"
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  Websites
                </Typography>
                <Typography variant="body2">
                  Stunning websites that enhance your online presence.
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ height: "100%", width: 300 }}>
              <CardMedia
                component="img"
                height="140"
                image="https://via.placeholder.com/300x200?text=Web+Apps"
                alt="Web Applications"
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  Web Apps
                </Typography>
                <Typography variant="body2">
                  Scalable web applications designed to streamline your
                  business.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 8, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Our Team
          </Typography>
          <Typography variant="body1" paragraph>
            Our team of senior developers and creative professionals is at the
            heart of everything we do. With years of experience and a deep
            understanding of the latest technologies, our experts are ready to
            take on any challenge.
          </Typography>
          <Button variant="contained" color="primary">
            Meet Our Team
          </Button>
        </Box>

        {/* Contact Section */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Let's Connect
          </Typography>
          <Typography variant="body1" paragraph>
            Have a project in mind? We would love to hear from you. Get in touch
            with us and let's build something amazing together.
          </Typography>
          <Button variant="outlined" color="primary">
            Contact Us
          </Button>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default AboutPage;
