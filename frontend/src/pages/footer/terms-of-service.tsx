import React from 'react';
import TermsOfService from '../../common/components/TermsOfServices';


const TermsOfServicePage: React.FC = () => {
  return (
    <div className="footerSection">
      <h2 className="sectionTitle">Terms of Service</h2>
      <TermsOfService />
    </div>
  );
};

export default TermsOfServicePage;

