package ir.ac.sbu.evaluation.dto.user.master;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.dto.user.PersonalInfoDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Master;
import javax.validation.constraints.NotBlank;
import lombok.Builder;

@JsonInclude(Include.NON_NULL)
public class MasterDto extends UserDto {

    @NotBlank
    private String degree;

    @JsonProperty(access = Access.READ_ONLY)
    private String universityName;

    @JsonProperty(access = Access.READ_ONLY)
    private String facultyName;

    public MasterDto() {
    }

    @Builder
    public MasterDto(long id,
            String firstName, String lastName, String fullName,
            String username, String password, String role,
            PersonalInfoDto personalInfo, String degree, String universityName, String facultyName) {
        super(id, firstName, lastName, fullName, username, password, role, personalInfo);
        this.degree = degree;
        this.universityName = universityName;
        this.facultyName = facultyName;
    }

    public static MasterDto from(Master master) {
        return builder()
                .id(master.getId())
                .username(master.getUsername()).password(master.getPassword())
                .firstName(master.getFirstName()).lastName(master.getLastName())
                .fullName(master.getFirstName() + " " + master.getLastName())
                .role(master.getRole())
                .personalInfo(master.getPersonalInfo() != null ? PersonalInfoDto.from(master.getPersonalInfo()) : null)
                .degree(master.getDegree())
                .universityName(master.getFaculty() != null ? master.getFaculty().getUniversity().getName() : null)
                .facultyName(master.getFaculty() != null ? master.getFaculty().getName() : null)
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

    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }
}
