import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import axios from "axios";
import { Button, Switch } from "antd";
import { useEffect, useState } from "react";
import XMLViewer from "react-xml-viewer";
import ParseXml from "./parseXml";
import { getData } from "@/utils";

export default function HopDetail({ hopsData, hopTitle }: any) {
  const [newTags, setNewTags] = useState<any>();
  const [updateTags, setUpdateTags] = useState<any>();
  const [deleteTags, setDeleteTags] = useState<any>();
  const [xmlData, setXmlData] = useState<any>(hopsData);
  const [isSwitch, setIsSwitch] = useState<boolean>(false);

  const [token, setToken] = useState<string>("");

  const fetchToken = async () => {
    try {
      const url = "/api/get-access-token/";
      const response = await getData(url);
      setToken(response?.accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddingTags = async () => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`,
        newTags,
        {
          headers: {
            Authorization: `Bearer ${token}`, //`Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      )
      .then((res) => {
        if (res.data) {
          setNewTags("");
          setXmlData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleUpdatingTags = async () => {
    await axios
      .patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`,
        updateTags,
        {
          headers: {
            Authorization: `Bearer ${token}`, // `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setUpdateTags("");
          setXmlData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDeletingTags = async () => {
    await axios
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`, {
        headers: {
          Authorization: `Bearer ${token}`, // `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
          "Content-Type": "application/json; charset=utf-8",
        },
        data: {
          tags: deleteTags.split(","),
        },
      })
      .then((res) => {
        if (res.data) {
          setDeleteTags("");
          setXmlData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const customTheme = {
    separatorColor: "#f43f5e",
    tagColor: "#fda4af",
    textColor: "#22d3ee",
  };

  return (
    <DashboardFrame title="Hop Details">
      <section className="flex space-x-2 h-auto">
        {/* xml display container */}
        <div className="w-1/2 h-[35rem] bg-cyan-950 p-4">
          <div className="flex justify-end mb-5 w-full">
            <Switch
              checkedChildren="Show XML"
              unCheckedChildren="Parse XML"
              onChange={(value: any) => setIsSwitch(value)}
            />
          </div>
          <div className="h-[30rem] overflow-y-auto">
            <div>
              {isSwitch ? (
                <ParseXml xmlData={xmlData} />
              ) : (
                <XMLViewer
                  xml={xmlData}
                  indentSize={5}
                  collapsible
                  theme={customTheme}
                  overflowBreak
                />
              )}
            </div>
          </div>
        </div>

        <section className="w-1/2 bg-blue-50 p-4">
          {/* add new tags section */}
          <div>
            <p className="text mb-2">Add New Tags</p>
            <textarea
              className="w-full h-32 min-h-20 max-h-32"
              value={newTags}
              onChange={(e: any) => setNewTags(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="primary"
                className="flex items-center"
                style={{
                  backgroundColor: "#087757",
                  border: "1px solid #e65e01",
                }}
                onClick={handleAddingTags}
                disabled={newTags ? false : true}
              >
                Add Tags
              </Button>
            </div>
          </div>

          {/* edit tags section */}
          <div>
            <p className="text mb-2">Edit Tags</p>
            <textarea
              className="w-full h-32 min-h-20 max-h-32"
              value={updateTags}
              onChange={(e: any) => setUpdateTags(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="primary"
                className="flex items-center"
                style={{
                  backgroundColor: "#FFBF00",
                }}
                onClick={handleUpdatingTags}
                disabled={updateTags ? false : true}
              >
                Update Tags
              </Button>
            </div>
          </div>

          {/* delete tags section */}
          <div>
            <p className="text mb-2">Delete Tags</p>
            <textarea
              className="w-full h-20 min-h-20 max-h-20"
              value={deleteTags}
              onChange={(e: any) => setDeleteTags(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <Button
                type="primary"
                className="flex items-center"
                style={{
                  backgroundColor: "#FF0000",
                  border: "1px solid #e65e01",
                }}
                onClick={handleDeletingTags}
                disabled={deleteTags ? false : true}
              >
                Delete Tags
              </Button>
            </div>
          </div>
        </section>
      </section>
    </DashboardFrame>
  );
}

export async function getServerSideProps({ params }: any) {
  let results;
  await axios
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${params.title}`, {
      headers: {
        Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
        "Content-Type": "application/xml; charset=utf-8",
        // `Bearer ${token}`
      },
    })
    .then((res) => {
      if (res.data) {
        results = res.data;
      }
    })
    .catch((err) => console.log(err));

  return {
    props: {
      hopsData: results,
      hopTitle: params.title,
    },
  };
}
