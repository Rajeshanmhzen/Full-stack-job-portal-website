import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT, SERVER_BASE_URL } from "../../utils/constant";
import { notifications } from "@mantine/notifications";
import { Button, Popover, TextInput, Textarea, Loader, FileInput } from "@mantine/core";
import { IoMdArrowRoundBack } from "react-icons/io";

const CompanyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [formData, setFormData] = useState({
    logo:"",
    name: "",
    email: "",
    website: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchCompanyDetail = async () => {
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
        withCredentials: true,
      });
      if (res.data.company) {
        setCompany(res.data.company);
        setFormData({
          logo:res.data.company.logo || null,
          name: res.data.company.name || "",
          email: res.data.company.email || "",
          website: res.data.company.website || "",
          location: res.data.company.location || "",
          description: res.data.company.description || "",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Company not found",
        color: "red",
      });
    }
  };

  useEffect(() => {
    fetchCompanyDetail();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${id}`,
        formData,
        { withCredentials: true }
      );
      notifications.show({
        title: "Success",
        message: "Company updated successfully",
        color: "green",
      });
      setPopoverOpened(false);
      fetchCompanyDetail(); // refresh data
    } catch (err) {
      notifications.show({
        title: "Update Failed",
        message: err?.response?.data?.message || "Something went wrong",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!company ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-10 rounded shadow-md shadow-purple-heart-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button
              leftSection={<IoMdArrowRoundBack size={17} />}
              variant="default"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Popover
              opened={popoverOpened}
              onChange={setPopoverOpened}
              width={300}
              position="bottom-end"
              withArrow
              shadow="md"
            >
              <Popover.Target>
                <Button
                  className="transition"
                  color="purple-heart.5"
                  onClick={() => setPopoverOpened((o) => !o)}
                >
                  Update Info
                </Button>
              </Popover.Target>
              <Popover.Dropdown>
                <form className="flex flex-col gap-2">
                  <FileInput clearable label="Upload company logo" placeholder="Upload logo" value={formData.logo}  onChange={(file)=> setFormData({...formData, logo:file})}/>
                  <TextInput
                    label="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <TextInput
                    label="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <TextInput
                    label="Website"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                  <TextInput
                    label="Location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                  <Textarea
                    label="Description"
                    minRows={2}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <Button
                    className=" mt-2"
                    color="purple-heart.5"
                    onClick={handleUpdate}
                    disabled={loading}
                  >
                    {loading ? <Loader size="xs" /> : "Save Changes"}
                  </Button>
                </form>
              </Popover.Dropdown>
            </Popover>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-x-0 sm:space-x-6 mt-7">
            <img
              src={`${SERVER_BASE_URL}/uploads/company-logos/${company.logo}`}
              alt="Company Logo"
              className="w-20 h-20 object-cover rounded-full border"
            />
            <div className="mt-4 sm:mt-0">
              <h2 className="text-2xl sm:text-3xl font-semibold text-mine-shaft-100">
                {company.name}
              </h2>
              <p className="text-sm text-mine-shaft-400">
                Registered on: {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6 text-mine-shaft-300 space-y-1">
            <p>
              <strong>Email:</strong> {company.email || "N/A"}
            </p>
            <p>
              <strong>Website:</strong> {company.website || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {company.location || "N/A"}
            </p>
            <p>
              <strong>About:</strong>{" "}
              {company.description || "No description provided."}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyDetail;
