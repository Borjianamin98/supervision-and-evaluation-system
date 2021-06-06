package ir.ac.sbu.evaluation.dto.user.admin;

import ir.ac.sbu.evaluation.dto.user.PersonalInfoDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Admin;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminDto extends UserDto {

    public AdminDto() {
    }

    @Builder
    public AdminDto(long id, String firstName, String lastName, String fullName, String username, String role,
            PersonalInfoDto personalInfo) {
        super(id, firstName, lastName, fullName, username, role, personalInfo);
    }

    public static AdminDto from(Admin admin) {
        return AdminDto.builder()
                .id(admin.getId())
                .username(admin.getUsername())
                .firstName(admin.getFirstName()).lastName(admin.getLastName())
                .fullName(admin.getFullName())
                .role(admin.getRole())
                .personalInfo(PersonalInfoDto.from(admin.getPersonalInfo()))
                .build();
    }

}
