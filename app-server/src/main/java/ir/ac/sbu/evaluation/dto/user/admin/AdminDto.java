package ir.ac.sbu.evaluation.dto.user.admin;

import ir.ac.sbu.evaluation.dto.user.PersonalInfoDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Admin;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDto extends UserDto {

    public AdminDto() {
    }

    @Builder
    public AdminDto(long id, String firstName, String lastName, String fullName, String username, String password,
            String role, PersonalInfoDto personalInfo) {
        super(id, firstName, lastName, fullName, username, password, role, personalInfo);
    }

    public static AdminDto from(Admin admin) {
        return builder()
                .id(admin.getId())
                .username(admin.getUsername()).password(admin.getPassword())
                .firstName(admin.getFirstName()).lastName(admin.getLastName())
                .fullName(admin.getFirstName() + " " + admin.getLastName())
                .role(admin.getRole())
                .personalInfo(admin.getPersonalInfo() != null ? PersonalInfoDto.from(admin.getPersonalInfo()) : null)
                .build();
    }

    public Admin toAdmin() {
        return Admin.builder()
                .firstName(getFirstName()).lastName(getLastName())
                .username(getUsername()).password(getPassword())
                .personalInfo(getPersonalInfo() != null ? getPersonalInfo().toPersonalInfo() : null)
                .build();
    }

}
