import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto p-8 max-w-4xl mb-12">
      <h1 className="text-4xl font-bold mb-4">About ElectroShop</h1>
      <p className="text-lg text-gray-700 mb-4">
        Founded in 2023, ElectroShop was born from a passion for electronics and
        a desire to make high-quality components accessible to everyone, from
        seasoned professionals to weekend hobbyists.
      </p>
      <p className="text-gray-600">
        Our mission is to power your projects with reliable, curated, and tested
        electronics. We believe that the right components can turn a good idea
        into a great innovation. That's why we meticulously select our inventory
        from trusted manufacturers and provide comprehensive support to our
        community.
      </p>
      <div className="my-4" />
      <a
        className="text-gray-600"
        href="https://www.flaticon.com/free-icon/ssd_4944503?term=electronic+devices&page=2&position=17&origin=style&related_id=4944503"
        title="ssd icons"
      >
        Electronic devices icons created by Freepik - Flaticon
      </a>
    </div>
  );
};

export default AboutPage;
