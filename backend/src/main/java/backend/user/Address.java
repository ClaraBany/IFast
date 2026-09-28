package backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
public class Address {

    private String street;
    
    private String number;

    private String neighborhood;

    private String city;

    private String state;

    @Column(name = "zip_code", length = 10)
    private String zipCode;

    private String country;

    private Double latitude;

    private Double longitude;
}