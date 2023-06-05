import DashboardFrame from "@/components/Dashboard/DashboardFrame";
import axios from "axios";
import { Button, Input } from "antd";
import { useState, useEffect } from "react";
import xml2js from "xml2js";

export default function HopDetail({ hopsData, hopTitle }: any) {
  const [newTags, setNewTags] = useState<any>();
  const [updateTags, setUpdateTags] = useState<any>();
  const [deleteTags, setDeleteTags] = useState<any>();
  const [data, setData] = useState<any>(hopsData);
  // let parser = new xml2js.Parser();
  // parser.parseString(hopsData, function (err, result) {
  //   console.log(result);
  // });

  const handleAddingTags = async () => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`,
        newTags,
        {
          headers: {
            Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
            "Content-Type": "application/json; charset=utf-8",
            // `Bearer ${token}`
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setNewTags("");
          setData(res.data);
          // refetch();
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
            Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
            "Content-Type": "application/json; charset=utf-8",
            // `Bearer ${token}`
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setUpdateTags("");
          setData(res.data);
          // refetch();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDeletingTags = async () => {
    // await axios
    //   .delete(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`,
    //     tags,
    //     {
    //       headers: {
    //         Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
    //         "Content-Type": "application/json; charset=utf-8",
    //         // `Bearer ${token}`
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //     if (res.data) {
    //       setTags("");
    //       setData(res.data);
    //       // refetch();
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  const fetchHop = async () => {
    try {
      await axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hop/${hopTitle}/`, {
          headers: {
            Authorization: `Token be8ad00b7c270fe347c109e60e7e5375c8f4cdd7`,
            "Content-Type": "application/xml; charset=utf-8",
            // `Bearer ${token}`
          },
        })
        .then((res) => {
          if (res.data) {
            setData(res.data);
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const refetch = () => {
    fetchHop();
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <DashboardFrame title="Hop Details">
      <section className="flex space-x-2 h-auto">
        <textarea name="" id="" className="w-1/2 h-2/3" rows="25">
          {data}
        </textarea>
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
