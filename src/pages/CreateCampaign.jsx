import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import RestrictedAccessBox from '../components/RestrictedAccessBox';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign, address, connect } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '', 
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) });
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide a valid image URL');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div className="flex justify-center items-center rounded-lg bg-[#1c1c24]">
      {address ? (
        <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-lg sm:p-10 p-4 w-full max-w-4xl">
          {isLoading && <Loader />}
          <div className="flex justify-center items-center p-4 sm:min-w-[380px] bg-[#3a3a43] rounded-lg mb-6">
            <h1 className="font-epilogue font-bold sm:text-2xl text-lg text-white">
              Start a Campaign
            </h1>
          </div>
  
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">
            <div className="flex flex-wrap gap-6">
              <FormField
                labelName="Your Name *"
                placeholder="Ex: Sai Vamsi"
                inputType="text"
                value={form.name}
                handleChange={(e) => handleFormFieldChange('name', e)}
              />
              <FormField
                labelName="Campaign Title *"
                placeholder="Give a short title"
                inputType="text"
                value={form.title}
                handleChange={(e) => handleFormFieldChange('title', e)}
              />
            </div>
  
            <FormField
              labelName="Story *"
              placeholder="Write your story/description"
              isTextArea
              value={form.description}
              handleChange={(e) => handleFormFieldChange('description', e)}
            />
  
            <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-lg">
              <img src={money} alt="money" className="w-10 h-10" />
              <h4 className="font-epilogue font-bold text-xl text-white ml-4">
                You will get 100% of the raised amount
              </h4>
            </div>
  
            <div className="flex flex-wrap gap-6">
              <FormField
                labelName="Goal *"
                placeholder="ETH 0.50"
                inputType="text"
                value={form.target}
                handleChange={(e) => handleFormFieldChange('target', e)}
              />
              <FormField
                labelName="End Date *"
                placeholder="End Date"
                inputType="date"
                value={form.deadline}
                handleChange={(e) => handleFormFieldChange('deadline', e)}
              />
            </div>
  
            <FormField
              labelName="Campaign image *"
              placeholder="Place an image URL of your campaign"
              inputType="url"
              value={form.image}
              handleChange={(e) => handleFormFieldChange('image', e)}
            />
  
            <div className="flex justify-center mt-8">
              <CustomButton
                btnType="submit"
                title="Submit new campaign"
                styles="bg-[#1dc071]"
              />
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-center items-center rounded-lg bg-[#1c1c24]">
          <RestrictedAccessBox handleConnect={connect} />
        </div>
      )}
    </div>
  );  
};

export default CreateCampaign;
