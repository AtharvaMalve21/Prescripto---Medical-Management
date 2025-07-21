import React from "react";

const About = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4 text-gray-700 font-nunito">
      <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
        About Prescripto
      </h1>
      <p className="max-w-3xl text-lg md:text-xl mb-6">
        Prescripto is a modern healthcare appointment system designed to connect
        patients with doctors in a seamless and efficient way. Our goal is to
        provide accessible, secure, and user-friendly medical services for
        everyone.
      </p>
      <p className="max-w-3xl text-md md:text-lg text-gray-600">
        Whether you're looking for a general physician, a specialist, or just
        want to track your appointments, Prescripto is here to make your
        healthcare experience smoother and smarter.
      </p>
    </div>
  );
};

export default About;
