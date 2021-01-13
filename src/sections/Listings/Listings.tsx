import { gql } from "apollo-boost";
import { useQuery, useMutation } from "react-apollo";
import { Alert, List, Avatar, Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Listings as ListingsData } from "./__generated__/Listings";
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing";
import "./styles/Listings.css";
import { ListingsSkeleton } from "./components";

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    if (data && data.listings !== null) {
      refetch();
    }
  };

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    );
  }

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      type="error"
      message="An unexpected error occurred while attempting to delete a listing."
      className="listings-alert"
    />
  ) : null;

  const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <div className="listings">
      <Spin indicator={spinIcon} spinning={deleteListingLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listingsList}
      </Spin>
    </div>
  );
};
