import React from "react";
import { Container } from "react-bootstrap";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";

function Footer() {
  return (
    <div className="bg-dark py-5 text-light mt-1">
      <Container>
        <div className="row ms-2">
          <div className="col-md-4">
            <h4 className="mb-4">ABOUT</h4>
            <p>WHO WE ARE</p>
            <p>CONTACT US</p>
            <p>LOCATION</p>
          </div>
          <div className="col-md-4">
            <h4 className="mb-4">LEARN MORE</h4>
            <p>PRIVACY</p>
            <p>SECURITY</p>
            <p>TERMS</p>
          </div>
          <div className="col-md-4">
            <h4 className="mb-4">SOCIAL LINKS</h4>
            <div className="d-flex align-items-center">
              <InstagramIcon
                style={{
                  fontSize: 40,
                  color: "#C13584",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
              <FacebookIcon
                style={{
                  fontSize: 40,
                  color: "#1877F2",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
              <EmailIcon
                style={{
                  fontSize: 40,
                  color: "#EA4335",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Footer;
