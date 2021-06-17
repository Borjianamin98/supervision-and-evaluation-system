package ir.ac.sbu.evaluation.dto.user.admin;

import ir.ac.sbu.evaluation.dto.user.PersonalInfoSaveDto;
import ir.ac.sbu.evaluation.dto.user.UserSaveDto;
import ir.ac.sbu.evaluation.model.user.Admin;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminSaveDto extends UserSaveDto {

    public AdminSaveDto() {
    }

    @Builder
    public AdminSaveDto(String firstName, String lastName, String username, String password,
            PersonalInfoSaveDto personalInfo) {
        super(firstName, lastName, username, password, personalInfo);
    }

    public Admin toAdmin() {
        return Admin.builder()
                .firstName(getFirstName()).lastName(getLastName())
                .username(getUsername())
                .password(getPassword())
                .personalInfo(getPersonalInfo().toPersonalInfo())
                .build();
    }
}
