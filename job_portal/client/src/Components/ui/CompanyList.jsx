import { useNavigate } from "react-router-dom";
import { SERVER_BASE_URL } from "../../utils/constant";

const CompanyList = ({ companies = [], loading }) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-heart-500 mb-6">
        Recent Registered Companies
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full text-left text-sm table-auto bg-white">
          <thead className="bg-purple-heart-600 text-white uppercase text-sm font-medium">
            <tr>
              <th className="px-6 py-4">Logo</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Registered Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 divide-y">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : companies.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No companies found.
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <img
                      src={`${SERVER_BASE_URL}/uploads/company-logos/${company.logo}`}
                      alt="Company Logo"
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{company.name}</td>
                  <td className="px-6 py-4">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/company/${company._id}`)}
                      className="bg-purple-heart-700 text-white px-3 py-1 rounded hover:bg-purple-heart-600 text-xs shadow cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyList;
