package backend.user.dto;

import backend.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
@AllArgsConstructor 
public class UserSummaryDto {
    private Long id;
    private String name;
    private String pictureUrl;

    public UserSummaryDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.pictureUrl = user.getPictureUrl();
    }
}   