package ir.ac.sbu.evaluation.dto.user.master;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.dto.user.PersonalInfoDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Master;
import javax.validation.constraints.NotBlank;
import lombok.Builder;

@JsonInclude(Include.NON_NULL)
public class MasterDto extends UserDto {

    @NotBlank
    private String degree;

    public MasterDto() {
    }

    @Builder
    public MasterDto(long id, String firstName, String lastName, String username, String password,
            PersonalInfoDto personalInfo, String degree) {
        super(id, firstName, lastName, username, password, personalInfo);
        this.degree = degree;
    }

    public static MasterDto from(Master master) {
        return builder()
                .id(master.getId())
                .username(master.getUsername()).password(master.getPassword())
                .firstName(master.getFirstName()).lastName(master.getLastName())
                .personalInfo(master.getPersonalInfo() != null ? PersonalInfoDto.from(master.getPersonalInfo()) : null)
                .degree(master.getDegree())
                .build();
    }

    public Master toMaster() {
        return Master.builder()
                .firstName(getFirstName()).lastName(getLastName())
                .username(getUsername()).password(getPassword())
                .personalInfo(getPersonalInfo() != null ? getPersonalInfo().toPersonalInfo() : null)
                .degree(degree)
                .build();
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }
}
