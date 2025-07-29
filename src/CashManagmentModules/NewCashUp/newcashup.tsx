import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NewCashupComponent: React.FC = () => {
  const navigate = useNavigate();

  const back = () => {
    navigate("/integration");
  };

  return (
    <div className="flex flex-col p-4">
      {/* Header Section */}
      <div className="container mx-auto">
        <div className="flex flex-row items-center">
          <ArrowBackIcon 
            className="text-2xl text-black cursor-pointer pl-3 py-4"
            onClick={back}
          />
          <div className="text-2xl font-normal text-black ml-4">Add New Client</div>
          <div className="ml-auto mt-4">
            <Button 
              variant="contained" 
              className="bg-black text-white"
              startIcon={<span className="material-icons">save</span>}
            >
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Form Sections */}
      <div className="container mx-auto mt-4">
        {/* Bank Information Section */}
        <div className="flex flex-row mb-6">
          <div className="w-1/3 font-bold text-lg">Bank Information</div>
          <div className="w-2/3">
            <div className="flex flex-row gap-4 mb-4">
              <div className="flex-1">
                <TextField
                  label="Bank Name"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
              <div className="flex-1">
                <TextField
                  label="Legal/Trade Name"
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="border-t-2 border-gray-200 my-4" />

        {/* Postal Address Section */}
        <div className="flex flex-row mb-6">
          <div className="w-1/3 font-bold text-lg">Postal Address</div>
          <div className="w-2/3">
            <div className="flex flex-row gap-4 mb-4">
              <div className="flex-1">
                <TextField
                  label="Address"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="Zip Code"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <TextField
                  label="Town/City"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="State/Region"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
              <div className="w-1/3">
                <TextField
                  select
                  label="Country"
                  variant="standard"
                  fullWidth
                  defaultValue="india"
                >
                  <MenuItem value="india">India</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                </TextField>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-t-2 border-gray-200 my-4" />

        {/* Primary Contact Section */}
        <div className="flex flex-row mb-6">
          <div className="w-1/3 font-bold text-lg">Primary Contact</div>
          <div className="w-2/3">
            <div className="flex flex-row gap-4 mb-4">
              <div className="w-1/3">
                <TextField
                  label="First Name"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="Middle Name"
                  variant="standard"
                  fullWidth
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="Last Name"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <TextField
                  label="Email"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="Mobile Number"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="Telephone"
                  variant="standard"
                  fullWidth
                />
              </div>
            </div>
          </div>
        </div>
        <hr className="border-t-2 border-gray-200 my-4" />

        {/* Account Information Section */}
        <div className="flex flex-row mb-6">
          <div className="w-1/3 font-bold text-lg">Account Information</div>
          <div className="w-2/3">
            <div className="flex flex-row gap-4">
              <div className="w-1/3">
                <TextField
                  label="Email"
                  variant="standard"
                  fullWidth
                  required
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="Password"
                  variant="standard"
                  type="password"
                  fullWidth
                  required
                />
              </div>
              <div className="w-1/3">
                <TextField
                  label="Confirm Password"
                  variant="standard"
                  type="password"
                  fullWidth
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCashupComponent;