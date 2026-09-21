package backend.user.dto;

import backend.user.Address;
import backend.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String pictureUrl;
    private String phoneNumber;
    private Address address;

    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.pictureUrl = user.getPictureUrl();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
    }
}   