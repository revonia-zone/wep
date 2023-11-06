import Avatar, { AvatarStyle} from "avataaars";

interface Props {
  className?: string
}


export default function UserAvatar(props: Props) {
  return (
    <Avatar
      className={props.className}
      avatarStyle={AvatarStyle.Circle}
      topType='LongHairStraight'
      accessoriesType='Blank'
      hairColor='BrownDark'
      facialHairType='Blank'
      clotheType='BlazerShirt'
      eyeType='Default'
      eyebrowType='Default'
      mouthType='Default'
      skinColor='Light'
    />
  )
}
