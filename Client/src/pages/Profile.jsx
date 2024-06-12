import React from 'react';
import { Avatar, IconButton } from '@mui/material';
import '../styles/StylesP/Profile.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../stores/authStore';

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

function Profile() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) {
    navigate('/login');
  }
  const { role, fullname, armyNo, email, mobileNo, rank, unit, dateOfCommission, dob } = user;
  const navigate = useNavigate();
  // const user = { name: 'some name' };

  return (
    <div className="p-0 m-0">
      <div className="py-10 flex flex-row justify-center gap-10 px-0 mx-0 w-screen">
        <div className="col-lg-4 w-2/5">
          <div className="mb-4 md:ml-10 md:w-auto w-full ml-6 shadow-slate-100/50 border-2 rounded-lg h-2/5">
            <div className="text-center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                alt="avatar"
                className="rounded-full mx-auto mb-3 mt-5"
                style={{ width: '120px' }}
              />
              <p className="text-lg font-semibold mb-1 text-black">{role}</p>
            </div>
          </div>

          <div className="card mb-4 md:ml-10 md:w-auto w-full ml-6">
            <div className="card-body p-0">
              <ul className="list-group list-group-flush rounded-3">
                <li className="list-group-item flex lg:flex-row flex-col lg:justify-around justify-center p-3  shadow-slate-100/50 border-2 rounded-lg mb-2">
                  <p className="lg:text-base text-sm font-semibold lg:text-left text-center">
                    ARMY NUMBER
                  </p>
                  <p className="lg:text-base text-sm lg:text-right text-center">{armyNo}</p>
                </li>
                <li className="list-group-item flex lg:flex-row flex-col justify-around p-3  shadow-slate-100/50 border-2 rounded-lg mb-2">
                  <p className="lg:text-base text-sm font-semibold  lg:text-left text-center">
                    RANK
                  </p>
                  <p className="lg:text-base text-sm lg:text-right text-center">{rank}</p>
                </li>
                <li className="list-group-item flex lg:flex-row flex-col justify-around p-3  shadow-slate-100/50 border-2 rounded-lg mb-2">
                  <p className="lg:text-base text-sm font-semibold  lg:text-left text-center">
                    UNIT
                  </p>
                  <p className="lg:text-base text-sm lg:text-right text-center">{unit}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col w-full">
          <div className="card mb-4 profileImage  md:w-11/12 w-full h-40">
            <p className="mx-auto lg:text-base text-sm w-11/12 h-11/12 text-center pt-12">
              "Success is not the key to happiness. Happiness is the key to success. If you love
              what you are doing, you will be successful." - Albert Schweitzer
            </p>
          </div>
          <div className="card mb-4 md:w-11/12 w-full">
            <div className="row w-full shadow-slate-100/50 border-2 rounded-lg">
              <div className="col-sm-3">
                <p className="md:text-base text-sm ml-5">Full Name</p>
              </div>
              <div className="col-sm-9">
                <p className="md:text-base text-sm mr-5">{fullname.toUpperCase()}</p>
              </div>
            </div>
            <hr />
            <div className="row w-full shadow-slate-100/50 border-2 rounded-lg">
              <div className="col-sm-3">
                <p className="md:text-base text-sm ml-5">Email Id</p>
              </div>
              <div className="col-sm-9">
                <p className="md:text-base text-sm mr-5">{email}</p>
              </div>
            </div>
            <hr />
            <div className="row w-full shadow-slate-100/50 border-2 rounded-lg">
              <div className="col-sm-3">
                <p className="md:text-base text-sm ml-5">Phone Number</p>
              </div>
              <div className="col-sm-9">
                <p className="md:text-base text-sm mr-5">{mobileNo}</p>
              </div>
            </div>
            <hr />
            <div className="row w-full shadow-slate-100/50 border-2 rounded-lg">
              <div className="col-sm-3">
                <p className="md:text-base text-sm ml-5">Date of Birth</p>
              </div>
              <div className="col-sm-9">
                <p className="md:text-base text-sm mr-5">
                  {new Date(dob).toISOString().split('T')[0]}
                </p>
              </div>
            </div>
            <hr />
            <div className="row w-full shadow-slate-100/50 border-2 rounded-lg">
              <div className="col-sm-3">
                <p className="md:text-base text-sm ml-5">Date of Commission</p>
              </div>
              <div className="col-sm-9">
                <p className="md:text-base text-sm mr-5">{dateOfCommission}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
