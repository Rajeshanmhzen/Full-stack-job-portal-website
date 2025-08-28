import { Button, Input } from '@mantine/core'
import { useEffect, useState } from 'react';
import { IoClose, IoLaptop } from "react-icons/io5";
import CompanyList from '../features/companies/CompanyList';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '../utils/constant';
import { useNavigate } from 'react-router-dom';

const Company = () => {
  const navigate = useNavigate()
    const [value, setValue] = useState('');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
    const fetchCompanies = async (searchName = "") => {
  try {
    setLoading(true);

    const url = searchName 
      ? `${COMPANY_API_END_POINT}/search?name=${searchName}` 
      : `${COMPANY_API_END_POINT}/search`;

    const res = await axios.get(url, {
     withCredentials:true
    });
    if (res.data.companies) {
      setCompanies(res.data.companies);
    } else {
      setCompanies([]);
    }
  } catch (err) {
    console.error(err);
    setCompanies([]);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
    const delay = setTimeout(() => {
      fetchCompanies(value);
    }, 500); 
    return () => clearTimeout(delay);
  }, [value]);

  return (
    <div className='max-w-6xl mx-auto my-10 shadow-sm shadow-purple-heart-500 px-4 py-8 rounded-xl'>
      <div className='flex items-center justify-between'>
        <Input
          placeholder="Search by name"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          rightSectionPointerEvents="all"
          mt="md"
          rightSection={
            <IoClose
              aria-label="Clear search"
              onClick={() => setValue('')}
              style={{ display: value ? undefined : 'none', cursor: 'pointer' }}
            />
          }
        />
        <Button leftSection={<IoLaptop size={14} />} variant="default" onClick={()=> navigate("/company/create")}>
          New Company
        </Button>
      </div>

      <CompanyList companies={companies} loading={loading} />
    </div>
  )
}

export default Company